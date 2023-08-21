import 'dart:convert';
import 'dart:html' if (dart.library.io) 'dart:io';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../config/connections/api_config.dart';

class AuthService {
  final Dio dio;
  final CookieJar cookieJar;
  final storage = FlutterSecureStorage();

  AuthService()
      : dio = Dio(),
        cookieJar = CookieJar() {
    if (!kIsWeb) {
      dio.interceptors.add(CookieManager(cookieJar));
    } else {
      dio.options.extra = {
        'withCredentials': true,
      };
      dio.interceptors.add(WebCookieManager());
    }
    loadCookies(); // Cargar cookies al iniciar el servicio
  }

  Future<void> saveCookiesWeb() async {
    if (!kIsWeb) return;

    final cookies = document.cookie;
    await storage.write(key: 'cookies_web', value: cookies);
  }

  Future<void> loadCookiesWeb() async {
    if (!kIsWeb) return;

    final cookiesString = await storage.read(key: 'cookies_web');
    if (cookiesString != null) {
      final cookiesList = cookiesString.split('; ');
      for (final cookie in cookiesList) {
        document.cookie = cookie; // Establecer cada cookie individualmente
      }
    }
  }

  Future<void> saveCookies() async {
    if (kIsWeb) {
      await saveCookiesWeb();
    } else {
      final cookies = await cookieJar.loadForRequest(Uri.parse(getServerUrl()));
      final cookiesList = cookies.map((cookie) => cookie.toString()).toList();
      print('Cookies saved: $cookiesList');
      await storage.write(key: 'cookies', value: jsonEncode(cookiesList));
    }
  }

  Future<void> loadCookies() async {
    if (kIsWeb) {
      await loadCookiesWeb();
    } else {
      final cookiesString = await storage.read(key: 'cookies');
      if (cookiesString != null) {
        final cookiesStringList = jsonDecode(cookiesString) as List;
        final cookies = cookiesStringList.map((cookieString) => Cookie.fromSetCookieValue(cookieString as String)).toList();
        final uri = Uri.parse(getServerUrl());
        cookieJar.saveFromResponse(uri, cookies);
      }
    }
  }


  Future<bool> isLoggedIn() async {
    await loadCookies();
    final serverUrl = getServerUrl();
    final uri = Uri.parse('$serverUrl/api/user');
    final response = await dio.getUri(uri);

    print('Response data: ${response.data}');

    if (response.statusCode == 200 && response.data is Map) {
      final responseData = response.data as Map;
      await saveCookies();
      if (responseData['user'] != null) {
        return true;
      }
    }
    return false;
  }
}

class WebCookieManager extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    handler.next(options); // No establecer la cabecera "Cookie" manualmente
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    handler.next(response); // No manejar la cabecera "set-cookie" manualmente
  }
}
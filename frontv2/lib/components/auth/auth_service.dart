import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/connections/api_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final Dio dio;
  final CookieJar cookieJar;
  final storage = FlutterSecureStorage();

  AuthService()
      : dio = Dio(),
        cookieJar = CookieJar() {
    dio.interceptors.add(CookieManager(cookieJar));
  }

  Future<void> saveCookies() async {
    final cookies = await cookieJar.loadForRequest(Uri.parse(getServerUrl()));
    final cookiesList = cookies.map((cookie) => cookie.toString()).toList();
    print('Cookies saved: $cookiesList');
    await storage.write(key: 'cookies', value: jsonEncode(cookiesList));
  }

  Future<void> loadCookies() async {
    final cookiesString = await storage.read(key: 'cookies');
    if (cookiesString != null) {
      final cookiesStringList = jsonDecode(cookiesString) as List;
      final cookies = cookiesStringList.map((cookieString) => Cookie.fromSetCookieValue(cookieString as String)).toList();
      final uri = Uri.parse(getServerUrl());
      cookieJar.saveFromResponse(uri, cookies);
    }
  }

  Future<bool> isLoggedIn() async {
    await loadCookies();
    final serverUrl = getServerUrl();
    final uri = Uri.parse('$serverUrl/api/user');
    final response = await dio.getUri(uri);

    print('Response data: ${response.data}'); // Impresión de la respuesta para diagnóstico

    if (response.statusCode == 200 && response.data is Map) {
      final responseData = response.data as Map;
      await saveCookies();
      final loggedIn = responseData['loggedIn'];
      if (loggedIn is bool) {
        return loggedIn;
      }
    }
    return false; // Retornar false si la clave 'loggedIn' no está presente o no es booleano
  }
}
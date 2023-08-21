import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:universal_io/io.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../config/connections/api_config.dart';

class AuthService {
  final Dio dio;
  final CookieJar? cookieJar;
  final storage = FlutterSecureStorage();

  AuthService()
      : dio = Dio(),
        cookieJar = (Platform.isAndroid || Platform.isIOS) ? CookieJar() : null {
    if (Platform.isAndroid || Platform.isIOS) {
      dio.interceptors.add(CookieManager(cookieJar!));
    }

// Configura Dio para enviar credenciales en la web
    if (!Platform.isAndroid && !Platform.isIOS) {
      dio.options.responseType = ResponseType.json;
      dio.options.followRedirects = false;
      dio.options.validateStatus = (status) => status! < 500;
      dio.options.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      };
      dio.options.extra = {
        'withCredentials': true,
      };
    }
  }

  Future<void> saveCookies() async {
    if (Platform.isAndroid || Platform.isIOS) {
      final cookies = await cookieJar!.loadForRequest(Uri.parse(getServerUrl()));
      final cookiesList = cookies.map((cookie) => cookie.toString()).toList();
      print('Cookies saved: $cookiesList');
      await storage.write(key: 'cookies', value: jsonEncode(cookiesList));
    } else {
// En la web, las cookies son manejadas automáticamente por el navegador
      print('Cookies for web are handled by the browser.');
    }
  }

  Future<void> loadCookies() async {
    if (Platform.isAndroid || Platform.isIOS) {
      final cookiesString = await storage.read(key: 'cookies');
      if (cookiesString != null) {
        final cookiesStringList = jsonDecode(cookiesString) as List;
        final cookies = cookiesStringList.map((cookieString) => Cookie.fromSetCookieValue(cookieString as String)).toList();
        final uri = Uri.parse(getServerUrl());
        cookieJar!.saveFromResponse(uri, cookies);
      }
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
      // Verifica la existencia del usuario en lugar de la clave 'loggedIn'
      if (responseData['user'] != null) {
        return true;
      }
    }
    return false; // Retornar false si el usuario no está presente
  }
}
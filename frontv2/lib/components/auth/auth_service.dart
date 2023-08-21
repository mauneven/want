import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/connections/api_config.dart';

class AuthService {
  final Dio dio;
  final CookieJar cookieJar;

  AuthService()
      : dio = Dio(),
        cookieJar = CookieJar() {
    dio.interceptors.add(CookieManager(cookieJar));
  }

  Future<void> saveCookies() async {
    final cookies = await cookieJar.loadForRequest(Uri.parse(getServerUrl()));
    final cookiesList = cookies.map((cookie) => cookie.toString()).toList();
    print('Cookies saved: $cookiesList'); // Imprime las cookies en la consola
    final prefs = await SharedPreferences.getInstance();
    prefs.setStringList('cookies', cookiesList); // Guarda como lista de strings
  }

  Future<void> loadCookies() async {
    final prefs = await SharedPreferences.getInstance();
    final cookiesStringList = prefs.getStringList('cookies');
    if (cookiesStringList != null) {
      final cookies = cookiesStringList.map((cookieString) => Cookie.fromSetCookieValue(cookieString)).toList();
      final uri = Uri.parse(getServerUrl());
      cookieJar.saveFromResponse(uri, cookies);
    }
  }

  Future<bool> isLoggedIn() async {
    await loadCookies();
    final serverUrl = getServerUrl();
    final uri = Uri.parse('$serverUrl/api/user');
    final response = await dio.getUri(uri);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.data);
      await saveCookies();
      return responseData['loggedIn'];
    } else {
      return false;
    }
  }
}
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';
import 'package:http/http.dart';
import 'dart:convert';
import '../../config/connections/api_config.dart';
import 'package:cookie_jar/cookie_jar.dart';

class AuthService {
  final http.Client _client;

  AuthService() : _client = IOClient();

  Future<bool> isLoggedIn() async {
    final serverUrl = getServerUrl();
    final uri = Uri.parse('$serverUrl/api/user');
    final cookieJar = CookieJar();
    final httpClient = HttpClient();

    final ioClient = IOClient(httpClient);
    final cookies = await cookieJar.loadForRequest(uri);
    final response = await ioClient.get(uri, headers: {'Cookie': cookies.toSet().join(';')});

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData['loggedIn'];
    } else {
      return false;
    }
  }
}
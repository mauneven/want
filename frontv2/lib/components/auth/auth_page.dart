import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config/connections/api_config.dart';

class AuthPage extends StatefulWidget {
  @override
  _AuthPageState createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  bool _isLoginMode = true; // Flag to switch between login & register
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _birthdateController = TextEditingController();

  Future<void> _submit() async {
    final serverUrl = getServerUrl();
    final uri = Uri.parse(_isLoginMode
        ? '$serverUrl/api/auth/login'
        : '$serverUrl/api/auth/register');

    final response = await http.post(uri, body: {
      'email': _emailController.text,
      'password': _passwordController.text,
      if (!_isLoginMode) 'firstName': _firstNameController.text,
      if (!_isLoginMode) 'lastName': _lastNameController.text,
      if (!_isLoginMode) 'phone': _phoneController.text,
      if (!_isLoginMode) 'birthdate': _birthdateController.text,
    });

    if (response.statusCode == 200 || response.statusCode == 201) {
      // Handle success
      print('Login/Register successful');
    } else {
      // Handle error
      print('Failed to login/register');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isLoginMode ? 'Login' : 'Register'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            if (!_isLoginMode)
              TextField(
                controller: _firstNameController,
                decoration: InputDecoration(labelText: 'First Name'),
              ),
            if (!_isLoginMode)
              TextField(
                controller: _lastNameController,
                decoration: InputDecoration(labelText: 'Last Name'),
              ),
            if (!_isLoginMode)
              TextField(
                controller: _phoneController,
                decoration: InputDecoration(labelText: 'Phone'),
              ),
            if (!_isLoginMode)
              TextField(
                controller: _birthdateController,
                decoration: InputDecoration(labelText: 'Birthdate'),
              ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _submit,
              child: Text(_isLoginMode ? 'Login' : 'Register'),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _isLoginMode = !_isLoginMode;
                });
              },
              child: Text(_isLoginMode
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'),
            ),
          ],
        ),
      ),
    );
  }
}
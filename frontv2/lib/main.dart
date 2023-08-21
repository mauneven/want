import 'package:flutter/material.dart';
import './components/navigation/bottom_navigation.dart';
import './components/posts/posts.dart';
import './components/search/search_page.dart';
import 'components/auth/auth_page.dart';
import 'components/auth/auth_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Want'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _currentIndex = 0;
  final GlobalKey<PostsPageState> _postsPageKey = GlobalKey();
  bool _isLoggedIn = false;

  void _updateLoginStatus(bool status) {
    setState(() {
      _isLoggedIn = status;
    });
  }

  void _onSearch(String searchTerm, int? mainCategory) {
    _postsPageKey.currentState?.search(searchTerm, mainCategory);
    setState(() {
      _currentIndex = 0; // Switch to the posts page
    });
  }

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final authService = AuthService();
    await authService.loadCookies(); // Cargar cookies antes de verificar
    final loggedIn = await authService.isLoggedIn();
    setState(() {
      _isLoggedIn = loggedIn;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          PostsPage(key: _postsPageKey),
          SearchPage(onSearch: _onSearch),
          AuthPage(onLoginSuccess: _updateLoginStatus),
          // Add other pages as needed based on the login status
        ],
      ),
      bottomNavigationBar: BottomNavigation(
        isLoggedIn: _isLoggedIn,
        currentIndex: _currentIndex,
        onTap: (index) {
          if (_isLoggedIn && index == 2) {
            // Handle the "Create Post" logic here
          } else {
            setState(() {
              _currentIndex = index;
            });
          }
        },
      ),
    );
  }
}
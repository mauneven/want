import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import './components/navigation/bottom_navigation.dart';
import './components/posts/postsCard.dart';
import 'dart:convert';

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
  List<dynamic> _posts = [];

  Future<void> _fetchPosts() async {
    final response = await http.get(Uri.parse('http://localhost:4000/api/posts'));
    if (response.statusCode == 200) {
      setState(() {
        _posts = json.decode(response.body)['posts'];
      });
    } else {
      throw Exception('Failed to fetch posts');
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchPosts();
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: (MediaQuery.of(context).size.width ~/ 200).clamp(1, 6), // Ajusta este valor según tus necesidades
          childAspectRatio: 0.8, // Ajusta este valor para cambiar la proporción de las tarjetas
        ),
        itemCount: _posts.length,
        itemBuilder: (context, index) {
          final post = _posts[index];
          return PostCard(
            title: post['title'],
            description: post['description'],
            price: post['price'].toDouble(),
            user: post['createdBy']['firstName'],
            photoUrl: post['photos'][0],
          );
        },
      ),
      bottomNavigationBar: BottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ),
    );
  }
}
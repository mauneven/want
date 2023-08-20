import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import './components/navigation/bottom_navigation.dart';
import './components/posts/postsCard.dart';
import 'dart:convert';
import './config/connections/api_config.dart';

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
  int _currentPage = 1;
  bool _isLoading = false;
  ScrollController _scrollController = ScrollController();

  Future<void> _fetchPosts({bool append = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    final serverUrl = getServerUrl();
    final response = await http.get(Uri.parse('$serverUrl/api/posts?page=$_currentPage'));
    if (response.statusCode == 200) {
      final newPosts = json.decode(response.body)['posts'];
      setState(() {
        if (append) {
          _posts.addAll(newPosts);
        } else {
          _posts = newPosts;
        }
        _isLoading = false;
        _currentPage++;
      });
    } else {
      throw Exception('Failed to fetch posts');
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchPosts();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
        // Reached the bottom, load more posts
        _fetchPosts(append: true);
      }
    });
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
        controller: _scrollController,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: (MediaQuery.of(context).size.width ~/ 200).clamp(1, 6), // Adjust this value as needed
          childAspectRatio: 0.8, // Adjust this value to change the proportion of the cards
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
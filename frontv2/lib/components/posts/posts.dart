import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../components/posts/postsCard.dart';
import 'dart:convert';
import '../../config/connections/api_config.dart';

class PostsPage extends StatefulWidget {
  PostsPage({Key? key}) : super(key: key);

  @override
  PostsPageState createState() => PostsPageState();
}

class PostsPageState extends State<PostsPage> {
  List<dynamic> _posts = [];
  int _currentPage = 1;
  bool _isLoading = false;
  ScrollController _scrollController = ScrollController();
  String? _searchTerm;
  int? _mainCategory;

  Future<void> _fetchPosts({bool append = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    final serverUrl = getServerUrl();
    final uri = Uri.parse('$serverUrl/api/posts')
        .replace(queryParameters: {
      'page': '$_currentPage',
      'searchTerm': _searchTerm,
      'mainCategory': _mainCategory?.toString(),
    });

    final response = await http.get(uri);
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

  void search(String searchTerm, int? mainCategory) {
    setState(() {
      _searchTerm = searchTerm;
      _mainCategory = mainCategory;
      _currentPage = 1;
    });
    _fetchPosts();
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

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      controller: _scrollController,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: (MediaQuery.of(context).size.width ~/ 200).clamp(1, 6),
        childAspectRatio: 0.8,
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
    );
  }
}
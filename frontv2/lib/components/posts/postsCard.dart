import 'package:flutter/material.dart';

class PostCard extends StatelessWidget {
  final String title;
  final String description;
  final double price;
  final String user;
  final String photoUrl;

  PostCard({
    required this.title,
    required this.description,
    required this.price,
    required this.user,
    required this.photoUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(
            photoUrl,
            height: 150,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text(description),
                SizedBox(height: 4),
                Text('\$$price'),
                SizedBox(height: 4),
                Text('User: $user'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

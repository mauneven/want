import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PostCard extends StatelessWidget {
  final String title;
  final String description;
  final double price;
  final String user;
  final String photoUrl;

  const PostCard({super.key,
    required this.title,
    required this.description,
    required this.price,
    required this.user,
    required this.photoUrl,
  });

  @override
  Widget build(BuildContext context) {
    final String fullPhotoUrl = "http://localhost:4000/$photoUrl";
    final formattedPrice = NumberFormat('#,##0', 'en_US').format(price);

    return Card(
      color: Color.fromRGBO(245, 245, 245, 1.0),
      shadowColor: Colors.black,
      surfaceTintColor: Colors.white,
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(
            fullPhotoUrl,
            height: 200,
            width: double.infinity,
            fit: BoxFit.cover,

          ),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(description),
                const SizedBox(height: 4),
                Text('\$$formattedPrice'),
                const SizedBox(height: 4),
                Text('User: $user'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

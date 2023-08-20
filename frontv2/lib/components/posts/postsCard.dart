import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../config/connections/api_config.dart';

class PostCard extends StatelessWidget {
  final String title;
  final String description;
  final double price;
  final String user;
  final String photoUrl;

  const PostCard({
    Key? key,
    required this.title,
    required this.description,
    required this.price,
    required this.user,
    required this.photoUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final serverUrl = getServerUrl();
    final String fullPhotoUrl = "$serverUrl/$photoUrl";
    final formattedPrice = NumberFormat('#,##0', 'en_US').format(price);

    return Card(
      color: const Color.fromRGBO(245, 245, 245, 1.0),
      shadowColor: Colors.black,
      surfaceTintColor: Colors.white10,
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Image.network(
              fullPhotoUrl,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Truncated title
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _truncateText(title, 18), // Adjust the max length as needed
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 4),
                // Truncated description
                Text(
                  _truncateText(description, 60), // Adjust the max length as needed
                  overflow: TextOverflow.ellipsis,
                ),
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

  // Function to truncate text if it's too long
  String _truncateText(String text, int maxLength) {
    if (text.length > maxLength) {
      return "${text.substring(0, maxLength)}...";
    }
    return text;
  }
}
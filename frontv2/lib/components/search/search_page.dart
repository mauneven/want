import 'package:flutter/material.dart';

class SearchPage extends StatelessWidget {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search...',
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
        ),
        Expanded(
          child: GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 3,
            ),
            itemCount: 5, // Number of categories
            itemBuilder: (context, index) {
              return ElevatedButton(
                onPressed: () {
                  // Handle category selection
                  print('Selected category ${index + 1}');
                },
                child: Text('Category ${index + 1}'),
              );
            },
          ),
        ),
      ],
    );
  }
}
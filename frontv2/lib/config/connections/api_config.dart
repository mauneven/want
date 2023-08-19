import 'package:universal_io/io.dart';

String getServerUrl() {
  if (Platform.isAndroid || Platform.isIOS) {
    // https://want.com.co for main
    return 'http://10.0.2.2:4000';
  } else {
    // same for web
    return 'http://localhost:4000';
  }
}
import 'package:universal_io/io.dart';

String getServerUrl() {
  if (Platform.isAndroid || Platform.isIOS) {
    return 'http://10.0.2.2:4000';
  } else {
    return 'http://localhost:4000';
  }
}
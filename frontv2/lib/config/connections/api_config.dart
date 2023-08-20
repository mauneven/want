import 'package:universal_io/io.dart';

String getServerUrl() {
  if (Platform.isAndroid || Platform.isIOS || Platform.isMacOS) {
    if (Platform.isAndroid){
      return 'http://10.0.2.2:4000';
    }
    else {
      return 'http://127.0.0.1:4000';
    }
  } else {
    // same for web
    return 'http://localhost:4000';
  }
}
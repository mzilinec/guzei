const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Gio = imports.gi.Gio;

let _httpSession = new Soup.Session();

class ImageProvider {

  constructor(name) {
    this.name = name;
  }

  update(base_dir, callback) {
    callback();
  }

  get_name() {
    return this.name;
  }

  get_image(base_dir) {
    return {
      'name': "",
      'desc': "",
      'path': null
    };
  }

  _save_image(url, path) {
    let message = Soup.form_request_new_from_hash("GET", url, {});
    _httpSession.queue_message(message, Lang.bind(this,
      function (_httpSession, message) {
        if (message.status_code !== 200)
          return;
        // if (!message.response_body.complete()) {
          // let foo = null;
          // foo.a();
        // }
        this._do_save(message.response_body, path);
      }
    ));
  }

  _do_save(response_body, path) {
    if (response_body == null || path == null) {
      return false;
    }
    let file = Gio.file_new_for_path(path);
    if (file.query_exists(null)) {
      file.delete(null);
    }
    let fos = file.create(0, null);
    if (fos != null) {
      let len = 1;
      let off = 0;
      while (len != 0) {
        let buf = response_body.get_chunk(off);
        if (buf == null) break;
        len = buf.length;
        off += buf.length;
        if (len != 0) {
          fos.write(buf.get_data(), null);
        }
      }
      fos.close(null);
    }
    // TODO unref file, stream
  }
}

class BingProvider extends ImageProvider {

  constructor() {
    super("bing");
    this.base_url = "http://www.bing.com";
  }

  update(base_dir, callback) {
    this._download_image_info((image) => {
      let url = this.base_url + image['url'];
      let name = "Image of the day";
      this._save_image(url, base_dir + "/image.jpg");
    });
    super.update(base_dir, callback);
  }

  get_image(base_dir) {
    return {
      'name': "Image of the day",
      'desc': "",
      'path': [base_dir + "/image.jpg"]
    };
  }

  _download_image_info(callback) {
    let url = this.base_url + "/HPImageArchive.aspx";
    let params = {
      'format': "js",
      'idx': "0",
      'n': "1",
      'mkt': "en-US"
    };
    let message = Soup.form_request_new_from_hash("GET", url, params);
    _httpSession.queue_message(message, Lang.bind(this,
      function (_httpSession, message) {
        if (message.status_code !== 200)
          return;
        let json = JSON.parse(message.response_body.data);
        let image = json['images'][0];
        callback(image);
      }
    ));
  }
}

class NasaAPODProvider extends ImageProvider {

  constructor() {
    super("nasa_apod");
    this.api_key = "DEMO_KEY";
  }

  update(base_dir, callback) {
    this._download_image_info((image) => {
      let url = image['url'];
      let name = image['title'];
      this._save_image(url, base_dir + "/image.jpg");
    });
    super.update(base_dir, callback);
  }

  get_image(base_dir) {
    // TODO save metadata - title, latest image, date, author
    return {
      'name': "Image of the day",
      'desc': "",
      'path': [base_dir + "/image.jpg"]
    };
  }

  _download_image_info(callback) {
    let url = "https://api.nasa.gov/planetary/apod";
    let params = {
      'api_key': this.api_key
    };
    let message = Soup.form_request_new_from_hash("GET", url, params);
    _httpSession.queue_message(message, Lang.bind(this,
      function (_httpSession, message) {
        if (message.status_code !== 200)
          return;
        let json = JSON.parse(message.response_body.data);
        callback(json);
      }
    ));
  }
}

class UnsplashProvider extends ImageProvider {
  constructor() {  // TODO save all, unsplash collection random, etc.
    super("unsplash");
  }

  update(base_dir, callback) {
    this._save_image("https://source.unsplash.com/random", base_dir + "/random.jpg");
    super.update(base_dir, callback);
  }

  get_image(base_dir) {
    // TODO save metadata - title, latest image, date, author
    return {
      'name': "Random unsplash image",
      'desc': "",
      'path': [base_dir + "/random.jpg"]
    };
  }
}

let _providers = [
  new BingProvider(),
  new NasaAPODProvider(),
  new UnsplashProvider()
];

function get_providers() {
  return _providers;
}

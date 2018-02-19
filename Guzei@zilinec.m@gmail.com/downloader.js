//the library to work with http request
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Gio = imports.gi.Gio;
// const GObject = imports.GObject;

// request parameters
let params = {
 amount: '1000',
 sourceCurrency: 'CHF',
 targetCurrency: 'EUR'
};

// new sesssion
let _httpSession = new Soup.Session();

// create http request:
// method (GET, POST, ...)
// URL
// request parameters
// let message = Soup.form_request_new_from_hash('GET', URL, params);

// add headers needed for Transfer Wise
// message.request_headers.append("X-Authorization-key", TW_AUTH_KEY);

// execute the request and define the callback
// _httpSession.queue_message(message, Lang.bind(this,
 // function (_httpSession, message) {
   // if (message.status_code !== 200)
     // return;
   // let json = JSON.parse(message.response_body.data);
   // do something with the data
 // })
// );

function write() {
  // TODO unref files, streams
  dir = Gio.file_new_for_path(".local/share/gmuzei");
  if (!dir.query_exists(null)) {
    dir.make_directory(null);
  }
  file = Gio.file_new_for_path(".local/share/gmuzei/foo.txt");
  if (file.query_exists(null)) {
    file.delete(null);
  }
  fos = file.create(0, null);
  if (fos != null) {
    fos.write("Foo!", null);
    fos.close(null);
  }
}

function get_foo() {
  url = "https://jsonplaceholder.typicode.com/posts/1";
  params = {};
  message = Soup.form_request_new_from_hash("GET", url, params);
  _httpSession.queue_message(message, Lang.bind(this,
    function (_httpSession, message) {
      if (message.status_code !== 200)
        return;
      let json = JSON.parse(message.response_body.data);
      global.log(json);
    }
  ));
};

const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Tweener = imports.ui.tweener;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Providers = Me.imports.providers;

let text, button;

function getSettings(schema) {
    if (Gio.Settings.list_schemas().indexOf(schema) == -1)
      return null;
        // TODO throw _("Schema \"%s\" not found.").format(schema);
    return new Gio.Settings({ schema: schema });
}

function open_app() {
  let app = Gio.DesktopAppInfo.new('guzei.desktop');
  app.launch([], global.create_app_launch_context(0, -1));
}

let settings;

function init() {
    // button = new St.Bin({ style_class: 'panel-button',
    //                       reactive: true,
    //                       can_focus: true,
    //                       x_fill: true,
    //                       y_fill: false,
    //                       track_hover: true });
    // let icon = new St.Icon({ icon_name: 'system-run-symbolic',
    //                          style_class: 'system-status-icon' });

    // button.set_child(icon);
    // button.connect('button-press-event', open_app);

    settings = getSettings("me.zilinec.guzei");
    if (settings != null) {
      settings.connect('changed', Lang.bind(this,this.update));
    }

    let interval = 60*60*2; // refresh every 2 hours
    update();
    Mainloop.timeout_add_seconds(interval, update);
    // TODO use xml desc. like file:///usr/share/backgrounds/f27/default/f27.xml
}
// 
// function enable() {
//     Main.panel._rightBox.insert_child_at_index(button, 0);
// }
//
// function disable() {
//     Main.panel._rightBox.remove_child(button);
// }

function get_default_provider_name() {
  // let settings = getSettings("me.zilinec.guzei");
  let provider_name = null;
  enabled = settings.get_boolean("enabled");
  if (!enabled) {
    return false;
  }
  provider_name = settings.get_string("image-provider");
  if (provider_name == null) {
    provider_name = "bing";
  }
  return provider_name;
}

function get_default_provider() {
  let providers = Providers.get_providers();
  let name = get_default_provider_name();

  if (providers == null) {
    throw "No image providers found!";
  } else if (name == null) {
    throw "Default provider is unknown!";
  }

  for (i = 0; i < providers.length; i++) {
    if (providers[i].get_name() === name) {
      return providers[i];
    }
  }
  return null;
}

function update() {
  if (!settings.get_boolean("enabled"))
    return true; // don't unschedule, otherwise we wouldn't know if to start it
  let provider = get_default_provider();
  if (provider == null) {
    global.log("Image provider not found!");
    return true; // still try again later
  }

  let base_dir = GLib.get_user_data_dir() + "/gmuzei/" + provider.get_name();
  ensure_dir(base_dir);

  provider.update(base_dir, function () {
    let info = provider.get_image(base_dir);
    let path = info['path'];
    if (path != null) {
      let settings = getSettings("org.gnome.desktop.background");
      settings.set_string("picture-uri", "file://" + path);
    }
  });
  return true;
}

// function showMessage(text) {
//   let label = new St.Label({ style_class: 'helloworld-label', text: text });
//   Main.uiGroup.add_actor(label);
//   label.opacity = 255;
//   let monitor = Main.layoutManager.primaryMonitor;
//   label.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
//                 monitor.y + Math.floor(monitor.height / 2 - text.height / 2));
//   Tweener.addTween(label, {
//                  opacity: 0,
//                  time: 2,
//                  transition: 'easeOutQuad',
//                  onComplete: function () {
//                    Main.uiGroup.remove_actor(label);
//                  }}
//   );
// }


function ensure_dir(dir) {
  let file = Gio.file_new_for_path(dir);

  if (!file.query_exists(null)) {
    file.make_directory_with_parents(null);
  } else if (file.query_file_type(0, null) !== Gio.FileType.DIRECTORY) {
    file.delete(null);
    file.make_directory_with_parents(null);
  }
}

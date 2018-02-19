#include <gtk/gtk.h>
#include <stdio.h>
#include <stdlib.h>
#include "glade-resources.h"
#include "glade-resources.c"


char *labels [] = {
  "Bing Picture of the day",
  "NASA Astronomy picture of the day",
  "Unsplash Random photos"
}; // TODO
char *names[] = {
  "bing",
  "nasa_apod",
  "unsplash"
};
num_items = 3;
GtkWidget **items = NULL;


void on_window_main_destroy(void) {
  gtk_main_quit();
}

void set_active_provider(const char *provider) {
  printf("Setting provider to %s\n", provider);

  const gchar *schema_id = "me.zilinec.guzei";
  GSettings* settings = g_settings_new(schema_id);
  if (settings != NULL) {
    g_settings_set_string(settings, "image-provider", provider);
  }
}

gchar *get_active_provider() {
  const gchar *schema_id = "me.zilinec.guzei";
  GSettings* settings = g_settings_new(schema_id);
  if (settings != NULL) {
    return g_settings_get_string(settings, "image-provider");
  }
  return NULL;
}

int get_is_enabled(void) {
  const gchar *schema_id = "me.zilinec.guzei";
  GSettings* settings = g_settings_new(schema_id);
  if (settings != NULL) {
    return g_settings_get_boolean(settings, "enabled");
  }
  return 0;
}

void on_box_toggled(GtkWidget *widget) {
  int active = gtk_toggle_button_get_active(widget);
  if (active && items) {
    uint i;
    for (i = 0; i < num_items; i++) {
      if (items[i] == widget) {
        set_active_provider(names[i]);
        return;
      }
    }
  }
}

void on_btn_activate_toggled(GtkCheckMenuItem *item) {
    gboolean active;
    g_object_get(item, "active", &active, NULL);
    printf("Enabled: %d\n", active);

    const gchar *schema_id = "me.zilinec.guzei";
    GSettings* settings = g_settings_new(schema_id);
    if (settings != NULL) {
      g_settings_set_boolean(settings, "enabled", active);
    }
}

int main(int argc, char *argv[]) {
  GtkBuilder *builder;
  GtkWidget  *window;
  GtkListBox *list;
  GtkWidget *btn_enabled;
  int i;
  items = (GtkWidget**) malloc(sizeof(GtkWidget*) * num_items);
  gchar *active_provider = get_active_provider();

  gtk_init(&argc, &argv);
  // builder = gtk_builder_new();
  // gtk_builder_add_from_file(builder, "gui.glade", NULL);
  builder = gtk_builder_new_from_resource("/me/zilinec/guzei/gui.glade");

  window = GTK_WIDGET(gtk_builder_get_object(builder, "window_main"));
  gtk_builder_connect_signals(builder, NULL);
  list = (GtkListBox*) GTK_WIDGET(gtk_builder_get_object(builder, "list_sources"));

  btn_enabled = (GtkWidget*) GTK_WIDGET(gtk_builder_get_object(builder, "btn_enable"));
  gtk_check_menu_item_set_active(btn_enabled, get_is_enabled());

  items[0] = NULL;
  for (i = 0; i < num_items; i++) {
    items[i] = gtk_radio_button_new_with_label_from_widget(items[0], labels[i]);
    if (!strcmp(names[i], active_provider)) {
      gtk_toggle_button_set_active(items[i], 1);
    }
    g_signal_connect(items[i], "toggled", G_CALLBACK(on_box_toggled), NULL);
    gtk_container_add(list, items[i]);
  }

  g_object_unref(builder);

  gtk_widget_show_all(window);
  gtk_main();

  return 0;
}

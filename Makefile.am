
GLIB_COMPILE_RESOURCES=glib-compile-resources

src/glade-resources.h: src/gresources.xml
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --generate $< --target=$@ --sourcedir=$(srcdir)/src
src/glade-resources.c: src/gresources.xml
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --generate $< --target=$@ --sourcedir=$(srcdir)/src

src/glade-resources.c src/glade-resources.h: \
    src/gresources.xml \
    $(shell $(GLIB_COMPILE_RESOURCES) --generate-dependencies $(srcdir)/src/gresources.xml --sourcedir=$(srcdir)/src)

bin_PROGRAMS = guzei
guzei_SOURCES = src/main.c # src/glade-resources.c src/glade-resources.h
guzei_CPPFLAGS = $(GTK_CFLAGS)
guzei_LDFLAGS= $(GTK_LIBS) -rdynamic
gsettings_SCHEMAS = src/me.zilinec.guzei.gschema.xml
@GSETTINGS_RULES@

guzei.desktop:
	$(shell awk "{ gsub(\"\\\\[EXEC_PATH\\\\]\",\"$(bindir)/guzei\"); print $0 }" guzei.desktop.in > guzei.desktop)

desktopdir = $(datadir)/applications
desktop_DATA = guzei.desktop

EXTRA_DIST = \
		src/gresources.xml \
		src/gui.glade \
		$(NULL)

CLEANFILES = src/glade-resources.h src/glade-resources.c \
		guzei.desktop me.zilinec.guzei.gschema.valid guzei

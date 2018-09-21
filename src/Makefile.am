GLIB_COMPILE_RESOURCES=glib-compile-resources

dist_data_DATA = gui.glade
guzei_SOURCES = main.c glade-resources.c glade-resources.h

glade-resources.h: gresources.xml
	glib-compile-resources --generate-header --target=$@ --sourcedir=$(srcdir) $(srcdir)/gresources.xml
glade-resources.c: gresources.xml
	glib-compile-resources --generate-source --target=$@ --sourcedir=$(srcdir) $(srcdir)/gresources.xml

#glade-resources.c glade-resources.h: gresources.xml $(shell $(GLIB_COMPILE_RESOURCES) --generate-dependencies resources.xml)
#	$(GLIB_COMPILE_RESOURCES) --target=$@  --generate-source $<

#glade-resources.c glade-resources.h: \
#    gresources.xml \
#    $(shell $(GLIB_COMPILE_RESOURCES) --generate-dependencies $(srcdir)/src/gresources.xml --sourcedir=$(srcdir)/src)


bin_PROGRAMS = guzei
guzei_CPPFLAGS = $(GTK_CFLAGS)
guzei_LDFLAGS= $(GTK_LIBS) -rdynamic

# Add GUI files to package
EXTRA_DIST = \
		gresources.xml \
		gui.glade \
		$(NULL)

#Install common settings schema
gsettings_SCHEMAS = me.zilinec.guzei.gschema.xml
@GSETTINGS_RULES@

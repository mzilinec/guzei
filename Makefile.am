SUBDIRS = src

#extension:
#	$(shell cp -r 'Guzei@zilinec.m@gmail.com' "${HOME}/.local/share/gnome-shell/extensions")

guzei.desktop:#extension
	$(shell awk "{ gsub(\"\\\\[EXEC_PATH\\\\]\",\"$(bindir)/guzei\"); print $0 }" guzei.desktop.in > guzei.desktop)

desktopdir = $(datadir)/applications
desktop_DATA = guzei.desktop #extension

#extdir = "~/.local/share/gnome-shell/extensions"
#ext_DATA = "Guzei@zilinec.m@gmail.com"

CLEANFILES = src/glade-resources.h src/glade-resources.c \
		guzei.desktop me.zilinec.guzei.gschema.valid guzei

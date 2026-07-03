/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uimenubarsystemdinamico;

import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CMenu;
import com.softcommerce.general.controles.CMenuBar;
import com.softcommerce.general.controles.CMenuItem;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.views.uihomesesion.InterUiHomeSesion;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import java.net.URL;
import org.apache.log4j.Logger;

public class UiMenuBarSystemDinamico
        extends CMenuBar
        implements ActionListener, InterUiMenuBarSystemDinamico {

    private static final long serialVersionUID = 1L;
    protected final InterUiHomeSesion frmsys;
    public URL path;
    CMenu[] menus;
    CMenuItem[] menusItem;
    List<Integer> vectorMenu;
    List<Integer> vectorMenuItem;
    protected final Usuario usuario;
    protected Gif gif;
    protected JButton btn;
    protected final Logger logger = Logger.getLogger(UiMenuBarSystemDinamico.class);

    public UiMenuBarSystemDinamico(InterUiHomeSesion frmsys, java.net.URL path, Usuario user) {
        super();
        this.frmsys = frmsys;
        this.path = path;
        this.usuario = user;
        initialize();
    }

    protected void initialize() {
        llenarMenu();
        gif = new Gif();
        llenarIcon();
    }

    protected void llenarIcon() {
        btn = new JButton(gif.UP);
        btn.addActionListener(this);
        this.add(btn);
    }

    protected void llenarMenu() {
    }

    protected int posMenu(int id_menu) {
        for (int i = 0; i < vectorMenu.size(); i++) {
            if (vectorMenu.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    protected int posMenuItem(int id_menu) {
        for (int i = 0; i < vectorMenuItem.size(); i++) {
            if (vectorMenuItem.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    protected void armarMenu(int indice, String menu) {
        this.menus[vectorMenu.size()] = new CMenu(menu);
        vectorMenu.add(indice);
    }

    protected void armarMenuItem(int indice, String menu) {
        this.menusItem[vectorMenuItem.size()] = new CMenuItem(menu);
        vectorMenuItem.add(indice);
    }

    protected void cargarBarra(int indice) {
    }

    protected void cargarMenu(int indPadre, int indice) {
    }

    protected void cargarMenuItem(int indPadre, int indice, final String nombre) {
    }

    @Override
    public void llamarEvento(String nombre) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btn)) {
            if (btn.getIcon().equals(gif.UP)) {
                btn.setIcon(gif.DOWN);
            } else {
                btn.setIcon(gif.UP);
            }
            frmsys.cambiarToolbarSystem();
        }
    }
}



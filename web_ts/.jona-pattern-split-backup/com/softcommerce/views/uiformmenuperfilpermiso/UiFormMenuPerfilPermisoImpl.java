package com.softcommerce.views.uiformmenuperfilpermiso;

import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.FormularioPerfilTableModel;
import com.softcommerce.reglasnegocio.RnUsuario;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.util.HashMap;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;

public class UiFormMenuPerfilPermisoImpl extends UiFormMenuPerfilPermiso {

    public UiFormMenuPerfilPermisoImpl(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil, MenuDinamico beanMenu,boolean sw) {
        super(parent, modal, ruta, beanPerfil, beanMenu, sw);
    }

    public UiFormMenuPerfilPermisoImpl(Dialog parent, boolean modal, java.net.URL ruta, BeanTipoTrabajadorPerfil beanPerfil,boolean sw) {
        super(parent, modal, ruta, beanPerfil, sw);
    }
}

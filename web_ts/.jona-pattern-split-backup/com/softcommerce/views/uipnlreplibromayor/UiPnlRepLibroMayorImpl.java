package com.softcommerce.views.uipnlreplibromayor;

import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.Constans;
import com.softcommerce.util.Exportar;
import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.border.TitledBorder;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.JRParameter;

public class UiPnlRepLibroMayorImpl extends UiPnlRepLibroMayor {

    public UiPnlRepLibroMayorImpl(String title, Main frm, Usuario usuario, java.net.URL path) {
        super(title, frm, usuario, path);
    }
}

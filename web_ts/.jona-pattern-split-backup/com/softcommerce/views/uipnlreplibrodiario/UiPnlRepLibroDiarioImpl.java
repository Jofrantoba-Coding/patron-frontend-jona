package com.softcommerce.views.uipnlreplibrodiario;

import com.softcommerce.beans.BeanAuxiliarContable;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAuxiliarContable;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.CheckListItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.render.CheckListRenderer;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;
import javax.swing.border.TitledBorder;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.JRParameter;

public class UiPnlRepLibroDiarioImpl extends UiPnlRepLibroDiario {

    public UiPnlRepLibroDiarioImpl(String title, Main frm, Usuario usuario, java.net.URL path) {
        super(title, frm, usuario, path);
    }
}

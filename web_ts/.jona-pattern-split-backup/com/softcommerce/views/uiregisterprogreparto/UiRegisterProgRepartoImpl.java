package com.softcommerce.views.uiregisterprogreparto;

import com.softcommerce.beans.BeanProgramacionReparto;
import com.softcommerce.beans.BeanTurno;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnReparto;
import com.softcommerce.reglasnegocio.RnTurno;
import com.softcommerce.util.CheckListItem;
import com.softcommerce.util.render.CheckListRenderer;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;

public class UiRegisterProgRepartoImpl extends UiRegisterProgReparto {

    public UiRegisterProgRepartoImpl(Frame arg0, Usuario usuario, java.net.URL path, BeanProgramacionReparto beanReparto) {
        super(arg0, usuario, path, beanReparto);
    }
}

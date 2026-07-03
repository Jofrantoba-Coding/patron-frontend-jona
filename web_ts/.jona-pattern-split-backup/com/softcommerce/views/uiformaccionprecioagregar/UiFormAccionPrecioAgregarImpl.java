package com.softcommerce.views.uiformaccionprecioagregar;

import com.softcommerce.beans.AccionPrecio;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import javax.swing.border.LineBorder;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class UiFormAccionPrecioAgregarImpl extends UiFormAccionPrecioAgregar {

    public UiFormAccionPrecioAgregarImpl(JDialog arg0, java.net.URL path, Component comp, boolean swReg) {
        super(arg0, path, comp, swReg);
    }

    public UiFormAccionPrecioAgregarImpl(JDialog arg0, java.net.URL path, Component comp, boolean swReg, AccionPrecio objAccionPrecio) {
        super(arg0, path, comp, swReg, objAccionPrecio);
    }
}

package com.softcommerce.views.uiformdireccionproveedor;

import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.ProveedorDireccion;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.logic.LogicDireccionProveedor;
import com.softcommerce.reglasnegocio.RnUbigeo;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.ArrayList;
import java.util.List;
import javax.swing.border.LineBorder;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class UiFormDireccionProveedorImpl extends UiFormDireccionProveedor {

    public UiFormDireccionProveedorImpl(JHDialog arg0,java.net.URL path,Component comp) {
        super(arg0, path, comp);
    }
}

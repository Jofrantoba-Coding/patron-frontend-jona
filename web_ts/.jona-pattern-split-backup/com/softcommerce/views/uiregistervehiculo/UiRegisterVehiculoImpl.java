package com.softcommerce.views.uiregistervehiculo;

import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
import com.softcommerce.reglasnegocio.RnVehiculo;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class UiRegisterVehiculoImpl extends UiRegisterVehiculo {

    public UiRegisterVehiculoImpl(JFrame arg0, Usuario usuario, BeanVehiculo wVehiculo) {
        super(arg0, usuario, wVehiculo);
    }
}

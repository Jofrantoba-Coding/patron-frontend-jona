package com.softcommerce.views.uiregistercierreaperturacaja;

import com.softcommerce.views.uipaneltfcierreaperturacaja.UiPanelTFCierreAperturaCaja;

import com.softcommerce.beans.CierreCaja;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.rn_CierraCaja;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dialog;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.MaskFormatter;

public class UiRegisterCierreAperturaCajaImpl extends UiRegisterCierreAperturaCaja {

    public UiRegisterCierreAperturaCajaImpl(Dialog arg0, Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterCierreAperturaCajaImpl(Frame frame, Usuario usuario, UiPanelTFCierreAperturaCaja pnltf) {
        super(frame, usuario, pnltf);
    }
}


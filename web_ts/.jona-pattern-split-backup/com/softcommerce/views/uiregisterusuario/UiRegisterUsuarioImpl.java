package com.softcommerce.views.uiregisterusuario;

import com.softcommerce.beans.Trabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CCheckBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CPasswordField;
import com.softcommerce.general.controles.EncryptDecrypt;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.LimitDocument;
import com.softcommerce.general.controles.Register;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTrabajador;
import com.softcommerce.reglasnegocio.RnUsuario;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;

public class UiRegisterUsuarioImpl extends UiRegisterUsuario {

    public UiRegisterUsuarioImpl(Frame arg0, Usuario usuario, PanelTFUsuario pnltf) {
        super(arg0, usuario, pnltf);
    }

    public UiRegisterUsuarioImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

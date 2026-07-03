package com.softcommerce.views.uiregistermotivonotacredito;

import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;
import java.awt.Color;
import java.awt.Component;
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
import java.awt.Font;
import java.awt.Frame;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class UiRegisterMotivoNotaCreditoImpl extends UiRegisterMotivoNotaCredito {

    public UiRegisterMotivoNotaCreditoImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterMotivoNotaCreditoImpl(Dialog arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

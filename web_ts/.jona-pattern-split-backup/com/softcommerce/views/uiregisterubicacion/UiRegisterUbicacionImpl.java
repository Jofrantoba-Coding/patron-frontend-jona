package com.softcommerce.views.uiregisterubicacion;

import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanLocalidad;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import org.apache.log4j.Logger;

public class UiRegisterUbicacionImpl extends UiRegisterUbicacion {

    public UiRegisterUbicacionImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

package com.softcommerce.views.uiregistercierreaperturafacturacion;

import com.softcommerce.beans.CierreFacturacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.reglasnegocio.rn_CierreFacturacion;
import com.toedter.calendar.JMonthChooser;
import com.toedter.calendar.JYearChooser;
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
import java.util.Date;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class UiRegisterCierreAperturaFacturacionImpl extends UiRegisterCierreAperturaFacturacion {

    public UiRegisterCierreAperturaFacturacionImpl(Frame arg0,Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterCierreAperturaFacturacionImpl(Dialog arg0,Usuario usuario) {
        super(arg0, usuario);
    }
}

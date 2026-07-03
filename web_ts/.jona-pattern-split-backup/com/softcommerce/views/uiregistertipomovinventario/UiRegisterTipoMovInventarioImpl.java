package com.softcommerce.views.uiregistertipomovinventario;

import com.softcommerce.beans.ClasifInventario;
import com.softcommerce.beans.TablaDetalleSunat;
import com.softcommerce.beans.TablaSunat;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;
import com.softcommerce.reglasnegocio.RnTablaDetalleSunat;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
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
import java.util.ArrayList;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

public class UiRegisterTipoMovInventarioImpl extends UiRegisterTipoMovInventario {

    public UiRegisterTipoMovInventarioImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterTipoMovInventarioImpl(Dialog arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

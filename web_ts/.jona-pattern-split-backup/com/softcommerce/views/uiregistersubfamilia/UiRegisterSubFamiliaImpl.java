package com.softcommerce.views.uiregistersubfamilia;

import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.entity.SubFamiliaSunat;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
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
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.util.List;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import org.apache.log4j.Logger;

public class UiRegisterSubFamiliaImpl extends UiRegisterSubFamilia {

    public UiRegisterSubFamiliaImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterSubFamiliaImpl(Dialog arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

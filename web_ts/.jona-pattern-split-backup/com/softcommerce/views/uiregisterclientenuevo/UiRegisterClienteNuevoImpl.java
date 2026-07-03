package com.softcommerce.views.uiregisterclientenuevo;

import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.AnexoPadron;
import com.softcommerce.beans.BeanCliente;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.ClasifCliente;
import com.softcommerce.beans.ClienteContacto;
import com.softcommerce.beans.ClienteCredito;
import com.softcommerce.beans.ClienteCuenta;
import com.softcommerce.beans.ClienteDireccion;
import com.softcommerce.beans.ClienteSustituto;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.CondicionPagoEnum;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.general.tablas.AnexoPadronTableModel;
import com.softcommerce.general.tablas.ClienteContactoTableModel;
import com.softcommerce.general.tablas.ClienteCreditoTableModel;
import com.softcommerce.general.tablas.ClienteCuentaTableModel;
import com.softcommerce.general.tablas.ClienteDireccionTableModel;
import com.softcommerce.general.tablas.ClienteSustitutoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.rn_ClasifCliente;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.render.CellRendererImageEstado;
import java.awt.BorderLayout;
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
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.border.LineBorder;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterClienteNuevoImpl extends UiRegisterClienteNuevo {

    public UiRegisterClienteNuevoImpl(Frame arg0, Usuario usuario) {
        super(arg0, usuario);
    }

    public UiRegisterClienteNuevoImpl(Dialog arg0, Usuario usuario) {
        super(arg0, usuario);
    }
}

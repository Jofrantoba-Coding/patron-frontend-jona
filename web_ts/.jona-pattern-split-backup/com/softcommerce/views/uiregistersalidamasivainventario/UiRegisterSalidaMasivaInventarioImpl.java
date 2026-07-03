package com.softcommerce.views.uiregistersalidamasivainventario;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.StockAlmacen;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.StockHistoricoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportarToExcel;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.Toolkit;
import java.beans.PropertyVetoException;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterSalidaMasivaInventarioImpl extends UiRegisterSalidaMasivaInventario {

    public UiRegisterSalidaMasivaInventarioImpl(String title, Main frm, JDesktopPane jdp, Usuario usuario) {
        super(title, frm, jdp, usuario);
    }
}

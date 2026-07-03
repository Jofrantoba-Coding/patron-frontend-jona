package com.softcommerce.views.uipnlconsultaventasalida;

import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPedidoDet;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.RegContaCab;
import com.softcommerce.beans.RegContaItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicVentas;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnPedidoCab;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportarToExcel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.Toolkit;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;

public class UiPnlConsultaVentaSalidaImpl extends UiPnlConsultaVentaSalida {

    public UiPnlConsultaVentaSalidaImpl(String title, java.net.URL path, Main frm, Usuario usuario) {
        super(title, path, frm, usuario);
    }
}

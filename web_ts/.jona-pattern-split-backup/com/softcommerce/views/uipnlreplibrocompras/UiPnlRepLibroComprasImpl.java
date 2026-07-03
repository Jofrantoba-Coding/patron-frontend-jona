package com.softcommerce.views.uipnlreplibrocompras;

import com.softcommerce.beans.BeanRptVenta;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.datasource.DataSourceRptVenta;
import com.softcommerce.formularios.*;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.tablemodel.TableModelTipoDoc;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Exportar;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.AbstractButton;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import javax.swing.UIManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRParameter;
import org.apache.log4j.Logger;

public class UiPnlRepLibroComprasImpl extends UiPnlRepLibroCompras {

    public UiPnlRepLibroComprasImpl(String title, Main frm, Usuario usuario, URL path, String tipo) {
        super(title, frm, usuario, path, tipo);
    }
}

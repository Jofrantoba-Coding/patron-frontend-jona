package com.softcommerce.views.uiformtcimportar;

import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.importar.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpTcTableModel;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import jxl.Cell;
import jxl.read.biff.BiffException;
import jxl.Sheet;
import jxl.Workbook;
import org.jdesktop.swingx.HorizontalLayout;

public class UiFormTcImportarImpl extends UiFormTcImportar {

    public UiFormTcImportarImpl(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, usuario, ruta);
    }
}

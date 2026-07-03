package com.softcommerce.views.uiformimportaranexo;

import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.importar.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpAnexoTableModel;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.util.ExceptionHandler;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.HeadlessException;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.sql.SQLException;
import java.text.ParseException;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import jxl.read.biff.BiffException;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

public class UiFormImportarAnexoImpl extends UiFormImportarAnexo {

    public UiFormImportarAnexoImpl(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, usuario, ruta);
    }
}

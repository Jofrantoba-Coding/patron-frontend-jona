package com.softcommerce.views.uiformimportaroc;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanImpOc;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.importar.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ImpOcTableModel;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnOrdenCompra;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CellRendererImpOc;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import jxl.Cell;
import jxl.read.biff.BiffException;
import jxl.Sheet;
import jxl.Workbook;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

public class UiFormImportarOcImpl extends UiFormImportarOc {

    public UiFormImportarOcImpl(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame, usuario, ruta);
    }
}

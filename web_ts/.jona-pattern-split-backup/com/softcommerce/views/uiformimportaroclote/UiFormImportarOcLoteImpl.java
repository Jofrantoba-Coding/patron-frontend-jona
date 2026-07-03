package com.softcommerce.views.uiformimportaroclote;

import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanImpCab;
import com.softcommerce.beans.BeanImpDet;
import com.softcommerce.beans.BeanImpGeneral;
import com.softcommerce.beans.BeanImpLote;
import com.softcommerce.beans.BeanImpOcLote;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanLaboratorioClinico;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.enums.AuxiliarEnum;
import com.softcommerce.enums.MonedaEnum;
import com.softcommerce.enums.TipoAnexoEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.importar.*;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.ImpOcLoteTableModel;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnInventarioInicial;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnLaboratorioClinico;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import jxl.Cell;
import jxl.read.biff.BiffException;
import jxl.Sheet;
import jxl.Workbook;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.HorizontalLayout;

public class UiFormImportarOcLoteImpl extends UiFormImportarOcLote {

    public UiFormImportarOcLoteImpl(JFrame frame, Usuario usuario, URL ruta) {
        super(frame, usuario, ruta);
    }
}

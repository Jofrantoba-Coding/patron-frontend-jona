package com.softcommerce.views.uiregisterconsultakardex;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.Kardex;
import com.softcommerce.beans.ContaItem;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.herramientas.CFunciones;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeEvent;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.event.FocusListener;
import java.awt.event.ItemListener;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JTabbedPane;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.tablas.KardexTableModel;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.ExportarToExcel;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Calendar;
import javax.swing.JOptionPane;

public class UiRegisterConsultaKardex 
        extends JDialog 
        implements InterUiRegisterConsultaKardex, KeyListener, ActionListener, MouseListener, ListSelectionListener, FocusListener, ItemListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    protected JComboBox cbo_tipo;
    protected JComboBox cbo_tipoMovimiento;
    protected List<TipoMovInventario> xTipoMovimiento;
    protected JPanel pnl_summary;
    protected JTextField txt_CodAltItem;
    protected JTextField txt_Familia;
    protected JTextField txt_Item;
    protected JTextField txt_UMStock;
    protected JTextField txt_Marca;
    protected JTextField txt_SubFamilia;
    protected JTextField txt_valorEntrada;
    protected JTextField txt_valorSalida;
    protected JTextField txt_valorSaldo;
    protected JTextField txt_montoEntrada;
    protected JTextField txt_montoSalida;
    protected JTextField txt_montoSaldo;
    protected JButton btn_exportar_excel;
    protected JButton btn_salir;
    protected JButton btn_generar_reporte;
    protected JButton btn_buscar;
    protected JTabbedPane tabb;
    protected KardexTableModel mdl_stock;
    protected CTable tbl_stock;
    protected String idalmacen;
    protected String iditem;
    protected JCheckBox chk_valorado;
    protected java.net.URL path;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected Main frame;

    public UiRegisterConsultaKardex(Main frm, java.net.URL path) {
        super(frm, "Kardex");
        frame = frm;
        this.path = path;
        inicialize();
    }

    protected void inicialize() {
    }

    public void showKardex(String iditem, String idalmacen) {
    }

    public void loadTipo() {
    }

    public void loadTipoMovimiento(String xCodTipo) {
    }

    public void loadDatosItem() {
    }

    public void cargarTablaKardex() {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean isSelected;

        isSelected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == chk_valorado) {
            mostrarStockValorado(!isSelected);
        }
    }

    public void calcularImportes() {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frame.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frame.getAnio()), 11, 31, 23, 59);
            dc_fechainicio.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechainicio.setSelectableDateRange(DateTime.format(0,0,0),dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frame.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frame.getAnio()), 11, 31, 23, 59);
            dc_fechafin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
            //dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(),new Date());
        }

        if (cbo_tipo == e.getSource()) {
            if (cbo_tipo.getItemCount() > 0) {
                if (cbo_tipo.getSelectedIndex() == 0) {
                    cbo_tipoMovimiento.removeAllItems();
                    cbo_tipoMovimiento.setEnabled(false);
                } else {
                    cbo_tipoMovimiento.setEnabled(true);
                    loadTipoMovimiento(cbo_tipo.getSelectedItem().toString());
                }
            }
        }

        if (e.getSource() == btn_salir) {
            dispose();
        }

        if (e.getSource() == btn_generar_reporte) {
            generarReporte(false);
        }

        if (e.getSource() == btn_exportar_excel) {
            //generarReporte(true);
            try {
                File archivo = File.createTempFile("Kardex" + (new Date()).getTime(), ".xlsx");
                archivo.deleteOnExit();
                ExportarToExcel export = new ExportarToExcel(archivo, tbl_stock);
                if (export.exportarJTableToExcel()) {
                    JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
                }
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }


        if (e.getSource() == btn_buscar) {
            cargarTablaKardex();
        }

    }

    public void generarReporte(boolean flag) {
    }

    public void mostrarStockValorado(boolean valor) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
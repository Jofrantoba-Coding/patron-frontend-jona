package com.softcommerce.views.uipnlrepkardex;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.Constans;
import com.softcommerce.util.Exportar;
import java.io.File;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.net.URL;
import javax.swing.ImageIcon;
import javax.swing.JInternalFrame;
import javax.swing.JOptionPane;
import javax.swing.UIManager;
import javax.swing.border.TitledBorder;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class UiPnlRepKardex
        extends JInternalFrame
        implements InterUiPnlRepKardex, ActionListener, FocusListener {

    protected JComboBox cbo_monto;
    protected JComboBox cboMesIni;
    protected JComboBox cboMesFin;
    protected JComboBox cbo_idalmacen;
    protected List<Almacen> x_idalmacen;
    protected JComboBox cbo_idpuntoventa;
    protected List<PuntoVenta> x_idpuntoventa;
    protected JComboBox cbo_idlocalidad;
    protected List<Localidad> x_idlocalidad;
    protected JTextField txt_descripcionitem;
    protected JTextField txt_iditem;
    protected JTextField txt_monto;
    protected final URL path;
    protected Usuario usuario = new Usuario();
    protected final String tipo;
    protected JCheckBox chkResumen;
    protected JCheckBox chkMesFin;
    protected JButton btnRepExcel;
    protected JButton btnVstaPrevia;
    protected JButton btnRepPd;

    public UiPnlRepKardex(String title, URL path, Usuario usuario, String tipo) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.tipo = tipo;
        inicialize();
    }

    protected void inicialize() {
    }

    protected JPanel getPnlReportes() {
        return null;
    }

    protected JButton getBtnRepExcel() {
        return null;
    }

    protected JButton getBtnVstaPrevia() {
        if (btnVstaPrevia == null) {
            btnVstaPrevia = new JButton("Vista Previa");
            btnVstaPrevia.setIcon(new ImageIcon(UiPnlRepKardex.class.getResource("/com/softcommerce/iconos/new_bucar_16.png")));
            btnVstaPrevia.setBounds(10, 30, 109, 33);
            btnVstaPrevia.addActionListener(this);
        }
        return btnVstaPrevia;
    }

    protected JButton getBtnRepPd() {
        if (btnRepPd == null) {
            btnRepPd = new JButton("Rep. PDF");
            btnRepPd.setIcon(new ImageIcon(PnlRepLibroDiario.class.getResource("/com/softcommerce/iconos/new_pdf_16.png")));
            btnRepPd.setBounds(134, 74, 109, 33);
            btnRepPd.addActionListener(this);
        }
        return btnRepPd;
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadAlmacen(String xcodPuntoventa) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_iditem && txt_iditem.getText().trim().length() > 0) {
            String serie = "000000" + txt_iditem.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 6, serie.length());

            txt_iditem.setText(nuevaserie);
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcionitem) {
            txt_descripcionitem.selectAll();
        }

        if (e.getSource() == txt_iditem) {
            txt_iditem.selectAll();
        }

        if (e.getSource() == txt_monto) {
            txt_monto.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (btnRepPd == e.getSource() || btnRepExcel == e.getSource() || btnVstaPrevia == e.getSource()) {
            try {
                String formato = "";
                if (btnRepExcel == e.getSource()) {
                    formato = "xlsx";
                } else {
                    formato = "pdf";
                }
                List listaRpt;
                RnLibros regla = new RnLibros(path);
                String mes_ini = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                String mes_fin = String.valueOf(cboMesFin.getSelectedIndex() + 1);
                if (mes_ini.length() == 1) {
                    mes_ini = "0" + mes_ini;
                }
                if (mes_fin.length() == 1) {
                    mes_fin = "0" + mes_fin;
                }
                String rutaJasper;
                String nombre_archivo;
                Map parameters = new HashMap();
                JRBeanCollectionDataSource dataSource;
                String id_punto_venta = "";
                String id_almacen = "";
                BigDecimal cantidad = new BigDecimal((txt_monto.getText().trim().length() == 0 ? "0" : txt_monto.getText().trim()));
                if (cbo_idpuntoventa.getSelectedIndex() > 0) {
                    id_punto_venta = x_idpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta();
                }
                if (cbo_idalmacen.getSelectedIndex() > 0) {
                    id_almacen = x_idalmacen.get(cbo_idalmacen.getSelectedIndex() - 1).getIdAlmacen();
                }
                if (chkResumen.isSelected()) {
                    if (tipo.equals("fisico")) {
                        parameters.put("P_FISICO", "S");
                        nombre_archivo = "ResumenSaldoFisico";
                    } else {
                        parameters.put("P_FISICO", "");
                        nombre_archivo = "ResumenSaldoValorado";
                    }
                    listaRpt = regla.reportResumenSaldoAlmacen(Main.anio, mes_ini, chkMesFin.isSelected() ? mes_fin : mes_ini, txt_iditem.getText().trim(), id_almacen, id_punto_venta, (txt_monto.getText().trim().length() == 0 ? "" : "S"), String.valueOf(cbo_monto.getSelectedItem()), cantidad);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptResumenSaldoAlmacen.jasper";
                } else {
                    if (tipo.equals("fisico")) {
                        listaRpt = regla.reportLibroInventarioFisico(Main.anio, mes_ini, chkMesFin.isSelected() ? mes_fin : mes_ini, txt_iditem.getText().trim(), id_almacen, id_punto_venta);
                        rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroInventario.jasper";
                        nombre_archivo = "KardexFisico";
                    } else {
                        listaRpt = regla.reportLibroInventarioValorado(Main.anio, mes_ini, chkMesFin.isSelected() ? mes_fin : mes_ini, txt_iditem.getText().trim(), id_almacen, id_punto_venta);
                        rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroInventarioVal.jasper";
                        nombre_archivo = "KardexValorado";
                    }
                    parameters.put("P_ESTABLECIMIENTO", usuario.getDireccion());
                    parameters.put("RUC", usuario.getRuc());
                }
                File file = File.createTempFile(nombre_archivo + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();
                dataSource = new JRBeanCollectionDataSource(listaRpt);

                parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
                parameters.put("P_ANIO", Main.anio);
                parameters.put("P_MES_INI", mes_ini);
                parameters.put("P_MES_FIN", chkMesFin.isSelected() ? mes_fin : "");
                parameters.put("TIPO_REPORTE", formato);
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                Exportar exportar = null;
                if (btnVstaPrevia == e.getSource()) {
                    exportar = new Exportar(parameters, dataSource, rutaJasper);
                    exportar.vistaPrevia(true);
                } else {
                    exportar = new Exportar(file, parameters, formato, dataSource, rutaJasper);
                    exportar.show();
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage());
            }
        }

        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                    cbo_idalmacen.removeAllItems();
                } else {
                    loadPuntoVenta(x_idlocalidad.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_idpuntoventa == e.getSource()) {
            if (cbo_idpuntoventa.getItemCount() > 0) {
                if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                    cbo_idalmacen.removeAllItems();
                    cbo_idalmacen.setEnabled(false);
                } else {
                    cbo_idalmacen.setEnabled(true);
                    loadAlmacen(x_idpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }
        if (chkMesFin == e.getSource()) {
            cboMesFin.setEnabled(chkMesFin.isSelected());
        }

    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarDatos() {
    }

    public void limpiarFiltro() {
    }

}

package com.softcommerce.formularios;

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

public class PnlRepKardex
        extends JInternalFrame
        implements ActionListener, FocusListener {

    private JComboBox cbo_monto;
    private JComboBox cboMesIni;
    private JComboBox cboMesFin;
    private JComboBox cbo_idalmacen;
    private List<Almacen> x_idalmacen;
    private JComboBox cbo_idpuntoventa;
    private List<PuntoVenta> x_idpuntoventa;
    private JComboBox cbo_idlocalidad;
    private List<Localidad> x_idlocalidad;
    private JTextField txt_descripcionitem;
    private JTextField txt_iditem;
    private JTextField txt_monto;
    private final URL path;
    private Usuario usuario = new Usuario();
    private final String tipo;
    private JCheckBox chkResumen;
    private JCheckBox chkMesFin;
    private JButton btnRepExcel;
    private JButton btnVstaPrevia;
    private JButton btnRepPd;

    public PnlRepKardex(String title, URL path, Usuario usuario, String tipo) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.tipo = tipo;
        inicialize();
    }

    private void inicialize() {
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setPreferredSize(new Dimension(650, 500));

        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(null);
        pnlGeneral.setBackground(new Color(245, 245, 245));
        JPanel pnlFiltro = new JPanel();
        pnlFiltro.setLayout(null);
        pnlFiltro.setOpaque(false);
        JLabel lblLocalidad = new JLabel("Localidad");
        lblLocalidad.setBounds(280, 25, 50, 20);
        lblLocalidad.setVisible(false);
        pnlFiltro.add(lblLocalidad);

        cbo_idlocalidad = new JComboBox();
        cbo_idlocalidad.setBounds(330, 25, 190, 20);
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.setEnabled(false);
        cbo_idlocalidad.setVisible(false);
        pnlFiltro.add(cbo_idlocalidad);

        JLabel lblPuntoVenta = new JLabel("P.Venta");
        lblPuntoVenta.setBounds(10, 25, 90, 20);
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        pnlFiltro.add(lblPuntoVenta);

        cbo_idpuntoventa = new JComboBox();
        cbo_idpuntoventa.setBounds(80, 25, 210, 20);
        cbo_idpuntoventa.addActionListener(this);
        pnlFiltro.add(cbo_idpuntoventa);

        JLabel lbl_Almacen = new JLabel("Almacén");
        lbl_Almacen.setFont(new Font("Verdana", 0, 11));
        lbl_Almacen.setBounds(325, 25, 70, 20);
        pnlFiltro.add(lbl_Almacen);

        cbo_idalmacen = new JComboBox();
        cbo_idalmacen.setBounds(400, 25, 195, 20);
        cbo_idalmacen.addActionListener(this);
        pnlFiltro.add(cbo_idalmacen);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setBounds(10, 60, 70, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnlFiltro.add(lbl_CodigoItem);

        txt_iditem = new JTextField();
        txt_iditem.setBounds(80, 60, 90, 20);
        txt_iditem.addFocusListener(this);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.setFont(new Font("Garamond", 0, 14));
        pnlFiltro.add(txt_iditem);

        txt_descripcionitem = new JTextField();
        txt_descripcionitem.setBounds(180, 60, 400, 20);
        txt_descripcionitem.setFont(new Font("Garamond", 0, 14));
        txt_descripcionitem.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionitem.setEnabled(false);
        pnlFiltro.add(txt_descripcionitem);

        JLabel lblMonto = new JLabel("Cant Fisica");
        lblMonto.setBounds(345, 95, 60, 20);
        lblMonto.setDisplayedMnemonic('o');
        pnlFiltro.add(lblMonto);

        cbo_monto = new JComboBox();
        cbo_monto.setBounds(420, 95, 50, 20);
        cbo_monto.addItem("=");
        cbo_monto.addItem("<>");
        cbo_monto.addItem("<");
        cbo_monto.addItem("<=");
        cbo_monto.addItem(">");
        cbo_monto.addItem(">=");
        cbo_monto.addActionListener(this);
        pnlFiltro.add(cbo_monto);

        txt_monto = new JTextField();
        txt_monto.setBounds(475, 95, 60, 20);
        txt_monto.setDocument(new DoubleDocument());
        txt_monto.addFocusListener(this);
        txt_monto.setFont(new Font("Garamond", 0, 14));
        pnlFiltro.add(txt_monto);

        JLabel lblFechaIni = new JLabel("MES INICIO");
        lblFechaIni.setBounds(10, 95, 70, 20);
        lblFechaIni.setDisplayedMnemonic('a');
        pnlFiltro.add(lblFechaIni);

        cboMesIni = new JComboBox();
        cboMesIni.setBounds(80, 95, 85, 20);
        cboMesIni.addItem("Enero");
        cboMesIni.addItem("Febrero");
        cboMesIni.addItem("Marzo");
        cboMesIni.addItem("Abril");
        cboMesIni.addItem("Mayo");
        cboMesIni.addItem("Junio");
        cboMesIni.addItem("Julio");
        cboMesIni.addItem("Agosto");
        cboMesIni.addItem("Setiembre");
        cboMesIni.addItem("Octubre");
        cboMesIni.addItem("Noviembre");
        cboMesIni.addItem("Diciembre");
        pnlFiltro.add(cboMesIni);

        chkMesFin = new JCheckBox("MES FIN");
        chkMesFin.setBounds(170, 95, 80, 20);
        chkMesFin.addActionListener(this);
        pnlFiltro.add(chkMesFin);

        cboMesFin = new JComboBox();
        cboMesFin.setBounds(250, 95, 85, 20);
        cboMesFin.setEnabled(false);
        cboMesFin.addItem("Enero");
        cboMesFin.addItem("Febrero");
        cboMesFin.addItem("Marzo");
        cboMesFin.addItem("Abril");
        cboMesFin.addItem("Mayo");
        cboMesFin.addItem("Junio");
        cboMesFin.addItem("Julio");
        cboMesFin.addItem("Agosto");
        cboMesFin.addItem("Setiembre");
        cboMesFin.addItem("Octubre");
        cboMesFin.addItem("Noviembre");
        cboMesFin.addItem("Diciembre");
        pnlFiltro.add(cboMesFin);

        chkResumen = new JCheckBox("Resumen Saldo");
        chkResumen.setBounds(10, 120, 150, 20);
        pnlFiltro.add(chkResumen);

        pnlFiltro.setBounds(10, 0, 600, 150);
        pnlGeneral.add(pnlFiltro);

        pnlGeneral.add(getPnlReportes());

        pnl.add(pnlGeneral, BorderLayout.CENTER);

        pnlPrincipal.add(pnl, "Center");
        getContentPane().add(pnlPrincipal);
        pack();
        setMaximizable(false);
        setResizable(false);
        setClosable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private JPanel getPnlReportes() {
        JPanel pnlReportes = new JPanel();
        pnlReportes.setLayout(null);
        pnlReportes.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Reportes", TitledBorder.LEADING, TitledBorder.TOP, null, null));
        pnlReportes.setBounds(200, 140, 263, 118);
        pnlReportes.add(getBtnVstaPrevia());
        pnlReportes.add(getBtnRepExcel());
        pnlReportes.add(getBtnRepPd());
        return pnlReportes;
    }

    private JButton getBtnRepExcel() {
        if (btnRepExcel == null) {
            btnRepExcel = new JButton("Rep. Excel");
            btnRepExcel.setBounds(10, 74, 109, 33);
            btnRepExcel.setIcon(new ImageIcon(PnlRepKardex.class.getResource("/com/softcommerce/iconos/new_exportar_16.png")));
            btnRepExcel.addActionListener(this);
        }
        return btnRepExcel;
    }

    private JButton getBtnVstaPrevia() {
        if (btnVstaPrevia == null) {
            btnVstaPrevia = new JButton("Vista Previa");
            btnVstaPrevia.setIcon(new ImageIcon(PnlRepKardex.class.getResource("/com/softcommerce/iconos/new_bucar_16.png")));
            btnVstaPrevia.setBounds(10, 30, 109, 33);
            btnVstaPrevia.addActionListener(this);
        }
        return btnVstaPrevia;
    }

    private JButton getBtnRepPd() {
        if (btnRepPd == null) {
            btnRepPd = new JButton("Rep. PDF");
            btnRepPd.setIcon(new ImageIcon(PnlRepLibroDiario.class.getResource("/com/softcommerce/iconos/new_pdf_16.png")));
            btnRepPd.setBounds(134, 74, 109, 33);
            btnRepPd.addActionListener(this);
        }
        return btnRepPd;
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (x_idlocalidad != null) {
                x_idlocalidad.clear();
            } else {
                x_idlocalidad = new ArrayList<Localidad>(10);
            }

            x_idlocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbo_idlocalidad.removeAllItems();
            cbo_idlocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < x_idlocalidad.size(); i++) {
                cbo_idlocalidad.addItem(x_idlocalidad.get(i).getDescripcion());
            }

            cbo_idlocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (x_idpuntoventa != null) {
                x_idpuntoventa.clear();
            } else {
                x_idpuntoventa = new ArrayList<PuntoVenta>(10);
            }

            x_idpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cbo_idpuntoventa.removeAllItems();
            cbo_idpuntoventa.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < x_idpuntoventa.size(); i++) {
                cbo_idpuntoventa.addItem(x_idpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cbo_idpuntoventa.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadAlmacen(String xcodPuntoventa) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);

            if (x_idalmacen != null) {
                x_idalmacen.clear();
            } else {
                x_idalmacen = new ArrayList<Almacen>(10);
            }

            x_idalmacen.addAll(regla_Almacen.listar("", "", xcodPuntoventa));

            cbo_idalmacen.removeAllItems();
            cbo_idalmacen.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < x_idalmacen.size(); i++) {
                cbo_idalmacen.addItem(x_idalmacen.get(i).getDescripcion());
            }

            cbo_idalmacen.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
        if (x_idlocalidad != null) {
            for (int i = 0; i < x_idlocalidad.size(); i++) {
                if (x_idlocalidad.get(i).getId_localidad().equals(xcodiLocalidad)) {
                    cbo_idlocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarDatos() {
        loadLocalidad(usuario.getCodempresa());
        cargarLocalidad(usuario.getCodlocalidad());
        limpiarFiltro();
    }

    public void limpiarFiltro() {
        if (cbo_idalmacen.getItemCount() > 1) {
            cbo_idalmacen.setSelectedIndex(1);
        }
        txt_descripcionitem.setText("");
        txt_iditem.setText("");
        cbo_monto.setSelectedItem(">");
        txt_monto.setText("0.0");
    }

}

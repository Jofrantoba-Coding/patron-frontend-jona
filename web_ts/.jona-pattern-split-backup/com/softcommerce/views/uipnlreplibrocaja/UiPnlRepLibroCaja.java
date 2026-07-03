package com.softcommerce.views.uipnlreplibrocaja;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.util.Exportar;
import com.softcommerce.iconos.Gif;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Toolkit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JInternalFrame;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.Constans;
import java.awt.FlowLayout;
import java.io.File;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.JOptionPane;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class UiPnlRepLibroCaja extends JInternalFrame implements InterUiPnlRepLibroCaja, ActionListener {

    private JComboBox cboMesIni;
    private JButton btnRepExcel;
    private JButton btnVstaPrevia;
    private JButton btnRepPd;
    private java.net.URL path;
    private Usuario usuario;
    public String tipo;
    private Gif gif;

    public UiPnlRepLibroCaja(String title, Main frm, Usuario usuario, java.net.URL path, String tipo) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        this.tipo = tipo;
        inicialize();
        initListener();
    }

    private void initListener() {
        btnVstaPrevia.addActionListener(this);
        btnRepExcel.addActionListener(this);
        btnRepPd.addActionListener(this);
    }

    private void inicialize() {

        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);
        getContentPane().add(pnlPrincipal);
        setMaximizable(false);
        setResizable(false);
        setClosable(true);
        pack();
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 5));
        JLabel lblInicio = new JLabel("Periodo Inicio:");
        pnl.add(lblInicio);
        cboMesIni = new JComboBox();
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
        pnl.add(cboMesIni);
        return pnl;
    }

    private JPanel getPnlOpciones() {
        JPanel pnl = new JPanel();
        btnVstaPrevia = new JButton("Vista Previa", gif.VistaPrevia);
        btnRepExcel = new JButton("Rep. Excel", gif.EXCEL);
        btnRepPd = new JButton("Rep. PDF", gif.ExportPdf);
        pnl.add(btnVstaPrevia);
        pnl.add(btnRepExcel);
        pnl.add(btnRepPd);
        return pnl;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btnRepPd == e.getSource() || btnRepExcel == e.getSource() || btnVstaPrevia == e.getSource()) {
            try {
                /*if ((txtPeriodoInicio.getText().trim().equals(""))) {
                 JOptionPane.showMessageDialog(this, "Ingrese Periodos");
                 return;
                 }*/
                String formato = "";
                if (btnRepExcel == e.getSource()) {
                    formato = "xlsx";
                } else {
                    formato = "pdf";
                }
                List listaRpt = new ArrayList();
                RnLibros regla = new RnLibros(path);
                File file = File.createTempFile((tipo.equals("caja") ? "LibroCaja" : "LibroBanco") + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();
                Map parameters = new HashMap();
                JRBeanCollectionDataSource dataSource;
                String rutaJasper = "";
                String mes_ini = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                if (mes_ini.length() == 1) {
                    mes_ini = "0" + mes_ini;
                }
                parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
                parameters.put("RUC", usuario.getRuc());
                parameters.put("P_ANIO", Main.anio);
                parameters.put("P_MES", mes_ini);
                parameters.put("TIPO_REPORTE", formato);
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                if (tipo.equals("caja")) {
                    listaRpt = regla.reportLibroCaja(Main.anio, mes_ini);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroCaja.jasper";
                } else {
                    listaRpt = regla.reportLibroBanco(Main.anio, mes_ini);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroBanco.jasper";
                }
                dataSource = new JRBeanCollectionDataSource(listaRpt);
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
    }
}
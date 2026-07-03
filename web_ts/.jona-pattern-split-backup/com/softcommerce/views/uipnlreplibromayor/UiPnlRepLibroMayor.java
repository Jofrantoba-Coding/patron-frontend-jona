package com.softcommerce.views.uipnlreplibromayor;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.util.Exportar;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.Constans;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JInternalFrame;
import javax.swing.border.TitledBorder;
import java.io.File;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class UiPnlRepLibroMayor extends JInternalFrame implements InterUiPnlRepLibroMayor, ActionListener {
    
    private JRadioButton chkDetallado;
    private JRadioButton chkConsolidado;
    private ButtonGroup bg_Report;
    private JButton btnRepExcel;
    private JButton btnVstaPrevia;
    private JButton btnRepPd;
    private java.net.URL path;
    private Usuario usuario;
    private JComboBox cboMesIni;
    private JComboBox cboMesFin;
    private Gif gif;
    
    public UiPnlRepLibroMayor(String title, Main frm, Usuario usuario, java.net.URL path) {
        super(title);
        this.path = path;
        this.usuario = usuario;
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
        bg_Report = new ButtonGroup();
        pnlPrincipal.add(getPnlNorth(), BorderLayout.NORTH);
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
    
    private JPanel getPnlNorth() {
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
        JLabel lblFin = new JLabel("Periodo Fin:");
        pnl.add(lblFin);
        cboMesFin = new JComboBox();
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
        pnl.add(cboMesFin);
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
    
    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlConsideraciones = new JPanel();
        pnlConsideraciones.setLayout(new BoxLayout(pnlConsideraciones, BoxLayout.Y_AXIS));
        pnlConsideraciones.setBorder(new TitledBorder(null, "Consideraciones", TitledBorder.LEADING, TitledBorder.TOP, null, null));
        chkDetallado = new JRadioButton("Reporte Detallado");
        chkDetallado.setSelected(true);
        chkConsolidado = new JRadioButton("Reporte Consolidado");
        bg_Report.add(chkDetallado);
        bg_Report.add(chkConsolidado);
        pnlConsideraciones.add(chkDetallado);
        pnlConsideraciones.add(chkConsolidado);
        pnl.add(pnlConsideraciones, BorderLayout.CENTER);
        return pnl;
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
                String mes_ini = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                String mes_fin = String.valueOf(cboMesFin.getSelectedIndex() + 1);
                if (mes_ini.length() == 1) {
                    mes_ini = "0" + mes_ini;
                }
                if (mes_fin.length() == 1) {
                    mes_fin = "0" + mes_fin;
                }
                List listaRpt = new ArrayList();
                RnLibros regla = new RnLibros(path);
                File file = File.createTempFile("LibroMayor" + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();
                Map parameters = new HashMap();
                JRBeanCollectionDataSource dataSource;
                String rutaJasper = "";
                parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
                parameters.put("RUC", usuario.getRuc());
                parameters.put("P_ANIO", Main.anio);
                parameters.put("P_MES_INI", mes_ini);
                parameters.put("P_MES_FIN", mes_fin);
                parameters.put("TIPO_REPORTE", formato);
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                if (chkDetallado.isSelected()) {
                    listaRpt = regla.reportLibroMayor(Main.anio, mes_ini, mes_fin);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroMayor.jasper";
                } else if (chkConsolidado.isSelected()) {
                    listaRpt = regla.reportLibroMayorConsolidado(Main.anio, mes_ini, mes_fin);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroMayorCons.jasper";
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
package com.softcommerce.views.uipnlreplibrodiario;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAuxiliarContable;
import com.softcommerce.beans.Usuario;
import com.softcommerce.util.Exportar;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAuxiliarContable;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Toolkit;
import java.awt.event.ItemListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JInternalFrame;
import javax.swing.border.TitledBorder;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.CheckListItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CheckListRenderer;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class UiPnlRepLibroDiario 
        extends JInternalFrame 
        implements InterUiPnlRepLibroDiario, ActionListener, ItemListener, MouseListener {
    
    protected Usuario usuario;
    protected java.net.URL path;
    protected JComboBox cboMesIni;
    protected JComboBox cboMesFin;
    protected ButtonGroup bg_Report;
    protected JRadioButton chkDetallado;
    protected JRadioButton chkConsolidado;
    protected JRadioButton chkdetalladoConsolidado;
    protected JButton btnRepExcel;
    protected JButton btnVstaPrevia;
    protected JButton btnRepPd;
    //private JLabel lblAuxiliares;
    //private JTextField txtAuxiliares;
    protected Gif gif;
    protected JList jlistAuxiliar;
    protected List<BeanAuxiliarContable> listAuxiliar;
    protected JScrollPane scroll;
    
    public UiPnlRepLibroDiario(String title, Main frm, Usuario usuario, java.net.URL path) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        inicialize();
        initListener();
    }
    
    protected void initListener() {
        btnVstaPrevia.addActionListener(this);
        btnRepExcel.addActionListener(this);
        btnRepPd.addActionListener(this);
        chkConsolidado.addActionListener(this);
        chkDetallado.addActionListener(this);
        chkdetalladoConsolidado.addActionListener(this);
        jlistAuxiliar.addMouseListener(this);
    }
    
    protected void inicialize() {
    }
    
    protected JPanel getPnlNorth() {
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
    
    protected JPanel getPnlOpciones() {
        return null;
    }
    
    protected JPanel getPnlCenter() throws Exception {
        return null;
    }
    
    protected String auxiliares() {
        String id_auxiliar = "";
        for (int i = 0; i < listAuxiliar.size(); i++) {
            CheckListItem item = (CheckListItem) jlistAuxiliar.getModel().getElementAt(i);
            if (item.isSelected()) {
                id_auxiliar += listAuxiliar.get(i).getIdAuxiliar() + ",";
            }
        }
        if (id_auxiliar.trim().length() > 0) {
            id_auxiliar = id_auxiliar.substring(0, id_auxiliar.trim().length() - 1);
        }
        System.out.println("id_auxiliar = " + id_auxiliar);
        return id_auxiliar;
    }
    
    @Override
    public void itemStateChanged(ItemEvent e) {
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (chkDetallado == e.getSource() || chkConsolidado == e.getSource() || chkdetalladoConsolidado == e.getSource()) {
            //lblAuxiliares.setVisible(chkdetalladoConsolidado.isSelected());
            //txtAuxiliares.setVisible(chkdetalladoConsolidado.isSelected());
            scroll.setVisible(chkdetalladoConsolidado.isSelected());
            pack();
        }
        
        if (btnRepPd == e.getSource() || btnRepExcel == e.getSource() || btnVstaPrevia == e.getSource()) {
            try {
                String formato = "";
                if (btnRepExcel == e.getSource()) {
                    formato = "xlsx";
                } else {
                    formato = "pdf";
                }
                List listaRpt = new ArrayList();
                RnLibros regla = new RnLibros(path);
                File file = File.createTempFile("LibroDiario" + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();
                String mes_ini = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                String mes_fin = String.valueOf(cboMesFin.getSelectedIndex() + 1);
                if (mes_ini.length() == 1) {
                    mes_ini = "0" + mes_ini;
                }
                if (mes_fin.length() == 1) {
                    mes_fin = "0" + mes_fin;
                }
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
                    listaRpt = regla.reportLibroDiario(Main.anio, mes_ini, mes_fin);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroDiario.jasper";
                } else if (chkConsolidado.isSelected()) {
                    listaRpt = regla.reportLibroDiarioConsolidado(Main.anio, mes_ini, mes_fin);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroDiarioCons.jasper";
                } else {
                    String id_auxiliar = auxiliares();
                    //listaRpt = regla.reportLibroDiarioConsolidado(Main.anio, mes_ini, mes_fin, txtAuxiliares.getText().trim());
                    listaRpt = regla.reportLibroDiarioConsolidado(Main.anio, mes_ini, mes_fin, id_auxiliar);
                    parameters.put("P_ITEMS", id_auxiliar);
                    rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroDiarioCons.jasper";
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
    
    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource().equals(jlistAuxiliar)) {
            int index = jlistAuxiliar.locationToIndex(e.getPoint());
            CheckListItem item = (CheckListItem) jlistAuxiliar.getModel().getElementAt(index);
            //if (item.isEnabled()) {
            item.setSelected(!item.isSelected());
            jlistAuxiliar.repaint(jlistAuxiliar.getCellBounds(index, index));
            //}
        }
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
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlreplibrodiariosimp;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAuxiliarContable;
import com.softcommerce.beans.Usuario;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnAuxiliarContable;
import com.softcommerce.reglasnegocio.RnLibros;
import com.softcommerce.util.CheckListItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.render.CheckListRenderer;
import com.softcommerce.util.Exportar;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;
import javax.swing.border.TitledBorder;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlRepLibroDiarioSimp 
        extends JInternalFrame 
        implements InterUiPnlRepLibroDiarioSimp, ActionListener, MouseListener {

    private JComboBox cboMesIni;
    private JButton btnRepExcel;
    private JButton btnVstaPrevia;
    private JButton btnRepPd;
    private java.net.URL path;
    private Usuario usuario;
    private Gif gif;
    private JRadioButton chkDetallado;
    private JRadioButton chkConsolidado;
    private JRadioButton chkdetalladoConsolidado;
    //private JTextField txtAuxiliares;
    private ButtonGroup bg_Report;
    //private JLabel lblAuxiliares;
    private JList jlistAuxiliar;
    private List<BeanAuxiliarContable> listAuxiliar;
    private JScrollPane scroll;

    public UiPnlRepLibroDiarioSimp(String title, java.net.URL path, Usuario usuario) {
        super(title);
        this.path = path;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        try {
            gif = new Gif();
            bg_Report = new ButtonGroup();
            JPanel pnlPrincipal = new JPanel();
            pnlPrincipal.setLayout(new BorderLayout());
            pnlPrincipal.add(getPnlNorth(), BorderLayout.NORTH);
            pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
            pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);

            getContentPane().add(pnlPrincipal);
            pack();
            setMaximizable(false);
            setResizable(false);
            setClosable(true);
            setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel getPnlCenter() throws Exception {
        try {
            JPanel pnl = new JPanel();
            pnl.setLayout(new BorderLayout());
            JPanel pnlConsideraciones = new JPanel();
            pnlConsideraciones.setLayout(new BoxLayout(pnlConsideraciones, BoxLayout.Y_AXIS));
            pnlConsideraciones.setBorder(new TitledBorder(null, "Consideraciones", TitledBorder.LEADING, TitledBorder.TOP, null, null));
            chkDetallado = new JRadioButton("Reporte Detallado");
            chkDetallado.setSelected(true);
            chkConsolidado = new JRadioButton("Reporte Consolidado");
            chkdetalladoConsolidado = new JRadioButton("Reporte Detallado y consolidado");
            bg_Report.add(chkDetallado);
            bg_Report.add(chkConsolidado);
            bg_Report.add(chkdetalladoConsolidado);
            pnlConsideraciones.add(chkDetallado);
            pnlConsideraciones.add(chkConsolidado);
            pnlConsideraciones.add(chkdetalladoConsolidado);
            pnl.add(pnlConsideraciones, BorderLayout.NORTH);
            Vector<CheckListItem> vtr = new Vector<CheckListItem>();
            RnAuxiliarContable logic = new RnAuxiliarContable(path);
            listAuxiliar = logic.listarAuxiliar("", "A");
            for (int i = 0; i < listAuxiliar.size(); i++) {
                vtr.add(new CheckListItem(listAuxiliar.get(i).getIdAuxiliar() + "-" + listAuxiliar.get(i).getDescripcion()));
            }
            jlistAuxiliar = new JList(vtr);
            jlistAuxiliar.setCellRenderer(new CheckListRenderer());
            jlistAuxiliar.setSelectionMode(
                    ListSelectionModel.SINGLE_SELECTION);
            scroll = new JScrollPane(jlistAuxiliar);
            scroll.setSize(new Dimension(200, 150));
            scroll.setVisible(false);
            pnl.add(scroll, BorderLayout.CENTER);
            return pnl;
        } catch (Exception e) {
            throw e;
        }
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
        return pnl;
    }

    private void initListener() {
        btnVstaPrevia.addActionListener(this);
        btnRepExcel.addActionListener(this);
        btnRepPd.addActionListener(this);
        chkConsolidado.addActionListener(this);
        chkDetallado.addActionListener(this);
        chkdetalladoConsolidado.addActionListener(this);
        jlistAuxiliar.addMouseListener(this);
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

    private String auxiliares() {
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
                File file = File.createTempFile("LibroDiarioSimplificado" + (new Date()).getTime(), "." + formato);
                file.deleteOnExit();
                String mes = String.valueOf(cboMesIni.getSelectedIndex() + 1);
                if (mes.length() == 1) {
                    mes = "0" + mes;
                }
                Map parameters = new HashMap();
                JRBeanCollectionDataSource dataSource;
                String rutaJasper = "";
                parameters.put("NOMBRE_EMPRESA", usuario.getDescriempresa());
                parameters.put("RUC", usuario.getRuc());
                parameters.put("P_ANIO", Main.anio);
                parameters.put("P_MES_INI", mes);
                parameters.put("TIPO_REPORTE", formato);
                parameters.put(JRParameter.REPORT_LOCALE, Locale.US);
                if (chkDetallado.isSelected()) {
                    listaRpt = regla.reportLibroDiarioSimp(Main.anio, mes);
                } else if (chkConsolidado.isSelected()) {
                    listaRpt = regla.reportLibroDiarioSimpCons(Main.anio, mes);
                } else {
                    String id_auxiliar = auxiliares();
                    //listaRpt = regla.reportLibroDiarioSimpCons(Main.anio, mes, txtAuxiliares.getText().trim());
                    listaRpt = regla.reportLibroDiarioSimpCons(Main.anio, mes, id_auxiliar);
                }
                rutaJasper = Constans.PATH_RPT_JASPER + "rptLibroDiarioSimp.jasper";
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
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, ex.getMessage());
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getSource().equals(jlistAuxiliar)) {
            int index = jlistAuxiliar.locationToIndex(e.getPoint());
            CheckListItem item = (CheckListItem) jlistAuxiliar.getModel().getElementAt(index);
            item.setSelected(!item.isSelected());
            jlistAuxiliar.repaint(jlistAuxiliar.getCellBounds(index, index));
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

package com.softcommerce.views.uiformventasprogramada;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanVentaProgramada;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelVentaProgramada;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FEtxt;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JDialog;
import java.net.URL;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import org.apache.log4j.Logger;

public class UiFormVentasProgramada
        extends JDialog
        implements InterUiFormVentasProgramada, ActionListener {

    protected final URL path;
    protected final Usuario usuario;
    protected final Main frmMain;
    protected Gif gif;
    protected JButton btnGuardar;
    protected JButton btnCancelar;
    protected JTable table;
    protected TableModelVentaProgramada modeltable;
    protected List<BeanVentaProgramada> listVtaProg;
    protected final Logger logger = Logger.getLogger(UiFormVentasProgramada.class);

    public UiFormVentasProgramada(Main frame, Usuario usuario, URL ruta, List<BeanVentaProgramada> listVtaProg) {
        super(frame, true);
        this.frmMain = frame;
        this.usuario = usuario;
        this.path = ruta;
        this.listVtaProg = listVtaProg;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlTable(), BorderLayout.CENTER);
        pnl.add(this.getPnlAcciones(), BorderLayout.SOUTH);
        this.getContentPane().add(pnl);
        setMinimumSize(new Dimension(600, 250));
        this.initListener();
        this.loadData();
        this.setResizable(false);
        this.pack();
        setLocation(0, 0);
    }

    protected void loadData() {
    }

    protected JPanel getPnlTable() {
        JPanel pnlTable = new JPanel(new BorderLayout());
        pnlTable.setLayout(new BorderLayout(0, 0));
        pnlTable.setBackground(new Color(245, 245, 245));

        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        modeltable = new TableModelVentaProgramada();
        table.setModel(modeltable);
        /*modeloOrdenado = new TableRowSorter(modeltable);
        table.setRowSorter(modeloOrdenado);
        table.getColumnModel().getColumn(0).setMinWidth(0);
        table.getColumnModel().getColumn(0).setMaxWidth(0);*/
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        JScrollPane scroll = new JScrollPane(table);
        CTableFx.setAllColumnPreferredWidth(table);
        scroll.setPreferredSize(new Dimension(600, 250));
        pnlTable.add(scroll, BorderLayout.CENTER);
        return pnlTable;
    }

    protected void initListener() {
        btnGuardar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    protected JPanel getPnlAcciones() {
        JPanel pnlAccion = new JPanel();
        //pnlAccion.setLayout(new GridBagLayout());
        pnlAccion.setBackground(new Color(245, 245, 245));
        //
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.setMnemonic('C');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.setFont(new Font("Verdana", 1, 10));
        btnCancelar.setOpaque(false);
        btnCancelar.setFocusPainted(false);
        pnlAccion.add(btnCancelar);
        //
        btnGuardar = new JButton("Guardar", gif.SAVE16);
        btnGuardar.setMnemonic('A');
        btnGuardar.setHorizontalAlignment(SwingConstants.LEFT);
        btnGuardar.setIconTextGap(10);
        btnGuardar.setFont(new Font("Verdana", 1, 10));
        btnGuardar.setOpaque(false);
        btnGuardar.setFocusPainted(false);
        pnlAccion.add(btnGuardar);
        return pnlAccion;

    }

    protected void guardar() throws Exception {
    }

    protected void exportarTxt(BeanVentaProgramada beanVtaProg) throws Exception {
    }

    protected String getNameFile(BeanVentaProgramada beanVtaProg) {
        return this.usuario.getRuc() + "-" + beanVtaProg.getIdTipoDoc() + "-" + beanVtaProg.getSerie() + "-" + beanVtaProg.getPreimpreso8Digs();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (btnCancelar.equals(e.getSource())) {
                dispose();
            }
            if (btnGuardar.equals(e.getSource())) {
                this.guardar();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }
}
